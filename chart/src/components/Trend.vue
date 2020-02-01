<script>
import { Line, mixins } from 'vue-chartjs'

export default {
  props: ['data', 'options'],
  mixins: [Line, mixins.reactiveProp],
  mounted () {
    this.renderChart(this.data, this.options)
  },
  watch: {
    data () {
      // this.$data._chart.update()
      this.renderChart(this.data, this.options)
    }
  }
}
</script>

<style>
</style>
